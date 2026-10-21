# Dota 2 Safe Lane 2v2 Strategy Reference

This document covers the strategic concepts Claude should apply when analysing safe lane 2v2 matchups. It is included verbatim in every analysis prompt.

---

## Safe Lane 2v2 Dynamics

The safe lane (Radiant bottom / Dire top) features a 2v2 matchup between the carry (position 1) and support (position 5) on each team. The lane geometry favours the defending team — the creep equilibrium naturally pushes toward the outer tower — so the attacking offlane duo must actively contest or go aggressive to gain value.

**Defensive play** works when the carry can free-farm under or near tower, their support provides healing or auras, and the lane opponent cannot safely harass. Defensive lanes aim for CS efficiency and level parity rather than kills.

**Aggressive play** (kill lanes) works when the duo has high early burst, strong disables, or both. The goal is to either kill the opposing carry before level 6 or zone them off XP range so they fall behind.

Key conditions that favour aggression:
- Initiation tool that goes through BKB or can be landed before the target can react (e.g. Bone Fletcher silence, Lion Hex)
- At least one stun or root to chain into a kill combo
- Both heroes have mana to combo at level 3 or 5
- Opposing lane has limited escape (no mobility spell, slow move speed)

---

## Creep Pulling and Creep Dragging

**Pulling** is when the support draws the neutral camp at the small or large pull camp into the lane creep wave, killing the lane wave faster (or denying it entirely) to starve the enemy carry of gold and XP. Effective pulling resets the wave equilibrium and keeps the lane near the friendly tower.

When pulling is valuable:
- Your carry is weaker and cannot fight early — pulling buys time and levels safely
- The enemy support is zoning your carry hard; pulling denies them the space to harass
- You need to stack camps for your carry to farm later

When pulling is less valuable:
- You are winning the lane and want to keep pressure on the enemy carry
- The enemy support can contest or ward off pull camps
- Your carry needs level 6 fast (e.g. Ursa, Bloodseeker) and denying them XP matters

**Creep dragging** (also called creep skipping or aggro pulling) is a more advanced tactic: the support tags the enemy creep wave with an attack or ability to lure it off the natural path, usually into a neutral camp or tower range, wiping the wave and denying the enemy carry XP and gold.

Dragging is most punishing when:
- The enemy carry is melee with no farming tool — they lose multiple waves of XP
- You have a support with a cheap ranged ability or long auto-attack range to tag creeps safely
- The opponent's support is occupied or dead

---

## Level Timing Windows

Lane outcomes are often decided at three level breakpoints. Understanding them allows you to predict when each side has an advantage.

**Level 3 (≈ 1:30–2:00 min):** The first major power spike for most heroes. Many kill combos come online at level 3 when a hero has their first two or three abilities. Aggressive duos target this window — if they cannot kill before the carry reaches level 3–4 and begins to out-stat them, the window may close. Heroes with strong level-1 or level-2 rotations (e.g. Shadow Demon with Disruption at level 1) can act even earlier.

**Level 6 (≈ 6:00–8:00 min):** Ultimate abilities change the lane equation drastically. Some ultimates define the entire game plan (Ursa's Enrage, Tiny's Grow, Vengeful Spirit's Nether Swap). A carry that reaches level 6 safely while their opponent is behind has often already won the lane. If an aggressive lane has not secured a kill advantage before level 6, the window is usually closed.

**Level 10 (≈ 15–18 min):** First talent tier activates. By this point the lane phase is effectively over. Level 10 talents can shift a hero's role significantly (e.g. a support gaining an AoE slow, a carry gaining a damage multiplier). Lane analysis rarely extends this far, but awareness of strong level-10 spikes is relevant for assessing whether a losing lane can survive to equalise.

---

## Lane Archetypes

**Kill lane:** Two heroes with high burst, a reliable disable, and kill potential at level 3–5. Examples: Lion + any right-clicker, Keeper of the Light + Ursa, Disruptor + Slark. Requires timing discipline — if the kill window passes without a takedown, the lane often stalls.

**Sustain lane:** Built around a healing support (Dazzle, Witch Doctor, Omniknight) paired with a durable carry. Trades favourably over time, is hard to kill, and is comfortable going even in CS against aggressive opponents. Weak to lanes that can burst through healing (Doom, Pugna) or who disengage and out-farm rather than fight.

**Poke lane:** Repeated ranged harassment, usually with a high-damage ranged support (Ancient Apparition, Lina, Shadow Fiend support), designed to force the enemy carry into a poor resource trade before committing to a kill. Works best when the opposing lane lacks gap-close or sustain. Vulnerable to lane-reset (pulling, dragging) that wastes the poke investment.

**Deathball / fast push lane:** Heroes designed to push the outer tower early (Lycan, Broodmother, Nature's Prophet). Forces the game into a format where the enemy must respond or lose a tower at 8–10 minutes. Weak to strong kill lanes that kill the carry before the push strategy matures.

---

## Hero Stat Thresholds

**Move speed:**
- ≥ 330: Very mobile, hard to harass or kite without a disable
- 310–329: Average; positioning matters
- ≤ 300: Slow; vulnerable to kiting, poke, and positional bullying
- Move speed differential of 20+ gives the faster hero a meaningful positioning advantage

**Attack range:**
- ≥ 600: Long ranged; can harass freely without entering melee danger zone
- 400–599: Mid-range; can harass but must be careful with follow-up
- ≤ 300: Melee or pseudo-melee; must commit to trades, vulnerable to ranged poke
- Ranged vs melee matchups heavily favour ranged heroes in early laning if there is no disable to punish the ranged hero

**Armor:**
- Each point of armor reduces physical damage by ~6% at typical early-game values
- ≥ 5 base armor: Durable against right-click harassment
- 0–2 base armor: Glass cannon — a single right-click support can chunk significantly
- Armor is more relevant against physical-heavy opponents; magic nukers bypass it entirely

**Base health and regen:**
- High base health (≥ 700) + regen (≥ 2 HP/s) allows a hero to sustain through poke
- Low regen (≤ 0.5 HP/s) means each harassment trade forces a base recall or tango use — track tango count as a resource

---

## Common Counter-Patterns

**Ranged vs melee:** Ranged heroes control the poke game. Melee carries must use abilities, creep aggro, or support cover to trade favourably. Melee heroes with high base damage or a gap-closing spell (Juggernaut Blade Fury, Dragon Knight Dragon Tail) can equalise.

**Stuns vs escape abilities:** A reliable stun (≥ 1.5 s) hard-counters most mobility spells if landed before the mobility activates. BKB-piercing stuns (Primal Roar, Berserker's Call) negate spell-immunity escapes. Heroes relying on escape abilities (Puck Illusory Orb, Weaver Shukuchi) are vulnerable to any disable that can be applied before they cast.

**Nuke combos:** Combos that chain stun into multiple damage sources (e.g. Lina Dragon Slave → Lion Impale + Finger) can burst carries in 1–2 rounds before they can react. Key factors: total damage, mana cost relative to level-3/5 mana pools, and whether a BKB-piercing component exists. If the combo kills at level 5 but not level 3, the lane is safe until that window.

**Spell immunity (BKB / innate):** A hero with an innate spell-immune period (Juggernaut Blade Fury, Lifestealer Rage, Ember Spirit Flame Guard) hard-counters disable-dependent kill lanes. Opponents must deal with them through physical burst, silences applied before activation, or waiting out the duration. Always flag when a hero's escape or survival tool provides magic immunity.

**Silences:** A silence prevents the target from casting abilities. Critical against combo-dependent heroes (Crystal Maiden, Lion, Lina) who cannot deal damage without spells. Less effective against right-click carries who deal damage through auto-attacks.

**Sustain vs burst:** Healing-based sustain (Dazzle Shallow Grave + Weave, Oracle Fortune's End + Purifying Flames) makes the lane nearly unkillable unless burst exceeds the heal rate. Hard-counter is dealing damage faster than it can be healed in a single combo (e.g. Lina + Ancient Apparition Ice Blast preventing healing entirely).

---

## Output Guidance for Claude

When applying this knowledge in an analysis:
1. Identify each team's archetype from the hero pair (kill lane, sustain, poke, push).
2. Flag the most important level windows for each side.
3. Highlight any spell-immunity interactions, silence vectors, or sustain counters explicitly.
4. State whether the lane advantage is decided by stat thresholds alone or requires execution of a specific combo.
5. Provide concrete advice for the weaker lane: pull timing, draft adjustments, aggressive options if any.
