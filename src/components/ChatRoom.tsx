import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { formatRelative } from "date-fns";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../lib/firebase";

type Message = {
  id: string;
  text: string;
  createdAt: Date;
  userId: string;
  userEmail: string;
};

export function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { currentUser, logout } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUser) return;

    const messagesRef = collection(db, "messages");
    const messagesQuery = query(messagesRef, orderBy("createdAt"));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Message[];

      setMessages(messagesData);
      setLoading(false);

      // Scroll to bottom after new messages
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !currentUser) return;

    setSending(true);

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        createdAt: serverTimestamp(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
    } finally {
      setSending(false);
    }
  };

  const formatDate = (date: Date) => {
    return formatRelative(date, new Date());
  };

  return (
    <Card className="w-full max-w-7xl mx-auto h-[calc(100vh-40px)]">
      <CardHeader className="flex flex-row items-center justify-between border-b py-2">
        <CardTitle className="font-extrabold text-3xl">Realtime Chat</CardTitle>
        <Button
          onClick={logout}
          className="bg-red-500 cursor-pointer hover:bg-red-600"
        >
          Logout
        </Button>
      </CardHeader>

      <CardContent className="custom-scrollbar flex flex-col space-y-4 h-[calc(100%-160px)] overflow-y-auto pb-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.userId === currentUser?.uid
                  ? "items-end"
                  : "items-start"
              }`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  message.userId === currentUser?.uid
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p>{message.text}</p>
              </div>
              <div className="text-xs text-muted-foreground mt-1 px-1">
                <span>{message.userEmail?.split("@")[0]}</span>
                <span className="mx-1">•</span>
                <span>{formatDate(message.createdAt)}</span>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </CardContent>

      <CardFooter className="mt-auto pt-4">
        <form onSubmit={sendMessage} className="flex w-full gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim() || sending}>
            {sending ? "Sending..." : "Send"}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
