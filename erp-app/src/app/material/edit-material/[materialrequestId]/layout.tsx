export const generateMetadata = async ({ params }: { params: Promise<{ materialrequestId: string }> }) => {
  const resolvedParams = await params;
  return {
    title: `Preview Material - ${resolvedParams.materialrequestId}`,
    description: "Preview details for the selected material",
  };
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
