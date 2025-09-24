import BaseLayout from "./BaseLayout";
import InstructorSidebar from "../components/instructor/InstructorSidebar";

const InstructorLayout = ({ children }) => {
  return (
    <BaseLayout SidebarComponent={InstructorSidebar}>{children}</BaseLayout>
  );
};

export default InstructorLayout;
