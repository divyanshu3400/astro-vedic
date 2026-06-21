import { memo } from 'react';
import { generateStars } from '../utils/helpers';

const stars = generateStars(100);

const StarField = memo(function StarField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            animationDelay: star.delay
          }}
        />
      ))}
    </div>
  );
});

export default StarField;
