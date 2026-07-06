import RegisterForm from '../components/RegisterForm';
import SEO from '../components/SEO';

interface RegisterPageProps {
  onRegisterSuccess: (user: any) => void;
}

export default function RegisterPage({ onRegisterSuccess }: RegisterPageProps) {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <SEO 
        title="Create Luxury Member Profile"
        description="Join Apex Beauty's inner circle. Register an account to view master stylist schedules, unlock signature booking services, and curate your personalized look portfolio."
        schemaType="Website"
      />
      <RegisterForm onSuccess={onRegisterSuccess} />
    </div>
  );
}
