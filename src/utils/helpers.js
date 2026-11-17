function getInitials(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("");
}
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
export {
  cn,
  getInitials
};
