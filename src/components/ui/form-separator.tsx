export const FormSeparator = ({ label }: { label: string }) => {
  return (
    <div className="relative my-2">
      <div className="absolute inset-0 flex items-center px-6">
        <span className="w-full border-t"></span>
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          {label}
        </span>
      </div>
    </div>
  );
};
