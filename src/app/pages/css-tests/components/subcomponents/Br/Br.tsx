export const Br = ({ n }: { n?: number }) => {
  if (!n) return <br />;

  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        return <br key={i} />;
      })}
    </>
  );
};
