const EditorLayout = async ({ children }: { children: React.ReactNode }) => (
  <div className="h-screen w-full overflow-hidden bg-background text-foreground font-sans base-transition">
    <main className="h-full w-full mx-auto max-w-(--editor-max-w)">{children}</main>
  </div>
);

export default EditorLayout;
