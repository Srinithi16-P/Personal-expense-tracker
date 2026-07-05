import {
  ShoppingCart, Utensils, Car, ShoppingBag, Film, Zap, Home, HeartPulse,
  Wallet, Briefcase, GraduationCap, Plane, Gift, Tag,
} from "lucide-react";


const MAP = [
  { match: /grocer/i, icon: ShoppingCart, color: "#F5A524" },
  { match: /food|dining|restaurant/i, icon: Utensils, color: "#F5A524" },
  { match: /transport|fuel|gas|travel/i, icon: Car, color: "#3B82F6" },
  { match: /shopping/i, icon: ShoppingBag, color: "#A855F7" },
  { match: /entertain/i, icon: Film, color: "#EC4899" },
  { match: /utilit|electric|water|bill/i, icon: Zap, color: "#EAB308" },
  { match: /rent|housing|home/i, icon: Home, color: "#EF4444" },
  { match: /health|medical|pharmacy/i, icon: HeartPulse, color: "#F43F5E" },
  { match: /salary|freelance|income|payroll/i, icon: Briefcase, color: "#1FD67A" },
  { match: /education|course|tuition/i, icon: GraduationCap, color: "#0EA5E9" },
  { match: /flight|vacation|trip/i, icon: Plane, color: "#06B6D4" },
  { match: /gift|donation/i, icon: Gift, color: "#F472B6" },
];

export const getCategoryMeta = (category = "") => {
  const found = MAP.find((m) => m.match.test(category));
  return found || { icon: Tag, color: "#9AA3B5" };
};

export const CategoryIcon = ({ category, size = 18 }) => {
  const { icon: Icon, color } = getCategoryMeta(category);
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: `${color}1A`, color }}
    >
      <Icon size={size} />
    </span>
  );
};
