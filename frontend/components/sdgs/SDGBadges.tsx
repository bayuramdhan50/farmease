'use client';

import SDGBadge from './SDGBadge';

export default function SDGBadges({ showTitles = false, size = 'sm' }) {
  const sdgs = [
    {
      number: 2,
      title: "Zero Hunger",
      color: "bg-yellow-500",
      icon: "🌾"
    },
    {
      number: 12,
      title: "Responsible Consumption",
      color: "bg-amber-600",
      icon: "♻️"
    },
    {
      number: 13,
      title: "Climate Action",
      color: "bg-green-600",
      icon: "🌡️"
    },
    {
      number: 15,
      title: "Life on Land",
      color: "bg-green-700",
      icon: "🌱"
    }
  ];

  return (
    <div className="flex space-x-2">
      {sdgs.map(sdg => (
        <SDGBadge
          key={sdg.number}
          number={sdg.number}
          title={sdg.title}
          color={sdg.color}
          icon={sdg.icon}
          showTitle={showTitles}
          size={size}
        />
      ))}
    </div>
  );
}
