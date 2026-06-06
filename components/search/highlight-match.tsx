type HighlightMatchProps = {
  text: string;
  query: string;
};

export function HighlightMatch({ text, query }: HighlightMatchProps) {
  const trimmed = query.trim();
  if (!trimmed) {
    return <>{text}</>;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = trimmed.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return <>{text}</>;
  }

  return (
    <>
      {text.slice(0, index)}
      <mark className="rounded bg-wadeal-coral/15 px-0.5 font-semibold text-wadeal-ink">
        {text.slice(index, index + trimmed.length)}
      </mark>
      {text.slice(index + trimmed.length)}
    </>
  );
}
