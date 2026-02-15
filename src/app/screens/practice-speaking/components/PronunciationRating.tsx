interface PronunciationRatingProps {
  rating: number;
}

export default function PronunciationRating({ rating = 0 }: PronunciationRatingProps) {

  if (rating <= 0) {
    return null;
  }

  // Max rating is 3. 
  if (rating > 3) { rating = 3; }

  return (
    <div className="flex flex-col items-end gap-1 ml-auto">
      <h2 className=" text-sm italic tracking-wide text-zinc-500">Pronunciation Rating</h2>
      <span className="text-sm italic tracking-wide text-amber-600">
        {Array.from({ length: rating }, () => "★").join(" ")}
      </span>
    </div>
  );
}
