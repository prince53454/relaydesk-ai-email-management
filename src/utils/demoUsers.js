const DEMO_USER_IDS = new Set([
  "usr_elena_vance_01",
  "usr_marcus_chen_02",
  "usr_victoria_03",
  "usr_david_thorne_04",
  "usr_aria_kapoor_05"
]);

function isDemoUser(user) {
  return Boolean(user?.id && DEMO_USER_IDS.has(user.id));
}

export { isDemoUser };
