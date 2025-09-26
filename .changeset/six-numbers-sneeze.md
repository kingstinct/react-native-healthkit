---
"@kingstinct/react-native-healthkit": major
---

- Clean up subscription logic (fixing #207)
- Using new workout statistics API, decoupling energy/distance units from workout (fixing #223 #180)
- Add null check for some Workout Route metadata preventing crashes for samples missing these (fixing #198)
- Expose temperature in workout metadata (fixing #181)
- Fix correlation sample saving issue (fixes #230)
- Upgrade example project to make sure everything works with latest stable Expo version
