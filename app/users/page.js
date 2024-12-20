import { UserManagement } from '@/components/UserManagement';
import { Container } from '@/components/ui/container';
import { MainLayout } from '@/components/MainLayout';

export default function UsersPage() {
  return (
    <MainLayout>
      <Container>
        <UserManagement />
      </Container>
    </MainLayout>
  );
} 