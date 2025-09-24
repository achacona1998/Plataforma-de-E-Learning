import BaseLayout from "./BaseLayout";
import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <BaseLayout SidebarComponent={AdminSidebar} showSearch={false}>
      {children}
    </BaseLayout>
  );
};

export default AdminLayout;
