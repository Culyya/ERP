export const generateMetadata = ({ params }: { params: { materialrequestId: string } }) => {
    return {
      title: `Preview Material - ${params.materialrequestId}`,
      description: "Preview details for the selected material",
    };
  };
  
  const Layout = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };
  
  export default Layout;
  