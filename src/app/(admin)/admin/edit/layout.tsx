const EditorLayout = async ({ children }: { children: React.ReactNode }) => (
  <div className="h-screen flex flex-col overflow-hidden bg-background text-foreground font-sans base-transition">
    <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
  </div>
);

export default EditorLayout;
