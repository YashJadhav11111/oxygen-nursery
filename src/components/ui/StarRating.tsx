interface Props {
  rating: number;
  size?: number;
  label?: string;
}

export function StarRating({ rating, size = 16, label }: Props) {
  return (
    <span className="stars" role="img" aria-label={label ?? `${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d="m12 3 2.6 5.7 6.2.7-4.6 4.2 1.3 6.1L12 16.7 6.5 19.7l1.3-6.1L3.2 9.4l6.2-.7z"
            fill={i <= Math.round(rating) ? 'var(--clay-500)' : 'var(--cream-300)'}
          />
        </svg>
      ))}
    </span>
  );
}

export default StarRating;
