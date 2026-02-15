interface PronunciationFeedbackProps {
  feedbackText?: string;
}

export default function PronunciationFeedback({
  feedbackText = ''
}: PronunciationFeedbackProps) {

  if (!feedbackText) {
    return null;
  }

  // Feedback comes back from the agent like this: 
  // "Mane <improve>G</improve>ujarātī bhāṣā śīkhvī <improve>game</improve> chhe."
  // We want to split the text on the <improve> tags. 
  // Then, we highlight the parts that are inside the <improve> tags.
  const parts = feedbackText.split(/(<improve>.*?<\/improve>)/g);

  const improvementStyle = "bg-yellow-200 text-yellow-900 font-semibold py-2 rounded";

  return (
    <div>
      <h2 className="mb-4 text-sm italic tracking-wide text-zinc-500">Pronunciation Feedback</h2>
      <p>
        {parts.map((part, index) => {
          if (part.startsWith('<improve>')) {
            return <span key={index} className={improvementStyle}>{part.replace(/<\/?improve>/g, '')}</span>;
          }
          return part;
        })}
      </p>
    </div>
  );
};
