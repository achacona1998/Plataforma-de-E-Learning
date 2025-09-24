import BaseLayout from "./BaseLayout";
import StudentSidebar from "../components/student/StudentSidebar";

const StudentLayout = ({ children }) => {
  return <BaseLayout SidebarComponent={StudentSidebar}>{children}</BaseLayout>;
};

export default StudentLayout;
