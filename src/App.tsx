import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AuthForm } from "./components/AuthForm";
import { ChatRoom } from "./components/ChatRoom";

function AppContent() {
  const { currentUser } = useAuth();
  
  return (
    <div className="flex items-center justify-center min-h-screen max-w-7xl mx-auto">
      {currentUser ? <ChatRoom /> : <AuthForm onSuccess={() => {}} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;