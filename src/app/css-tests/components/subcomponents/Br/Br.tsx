export const Br = ({ n }: { n?: number }) => {
  if (!n) return <br />;

  const brs = [];
  for (let i = 0; i < n; i++) {
    brs.push(<br key={i} />);
  }

  return brs;
};
