import LoginForm from '../components/LoginForm';
import SEO from '../components/SEO';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <SEO 
        title="Sign In to Your Portfolio"
        description="Log in to manage your premium scheduled hair treatments, review balayage color plans, and track reservations at Apex Beauty."
        schemaType="Website"
      />
      <LoginForm onSuccess={onLoginSuccess} />
    </div>
  );
}
