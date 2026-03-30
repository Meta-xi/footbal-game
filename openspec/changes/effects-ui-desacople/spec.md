# Delta Spec: Decoupling UI Effects from MotionsService

This document specifies the changes to decouple UI effects (audio and confetti) from the `MotionsService` to improve performance and user control.

---

## Domain: `services/motions`

### MODIFIED Requirements

#### Requirement: Decoupled State Management

The `MotionsService` **MUST** manage the state of missions, rewards, and related data using Angular Signals. It **MUST NOT** contain any logic related to UI effects like sound or visual celebrations. All interactions with UI effects **MUST** be handled by emitting events through `output()` signals.

**(Previously: The service was responsible for both data management and triggering UI effects directly.)**

##### Scenario: Successful Mission Claim
- **GIVEN** a user has met the criteria for a mission
- **WHEN** the user claims the mission and the backend responds with success
- **THEN** the `MotionsService` **MUST** update its internal `missions` signal to reflect the claimed status
- **AND** the `MotionsService` **MUST** emit a `missionClaimed` event via its output signal with the `missionId` and `type`.

##### Scenario: Failed Mission Claim
- **GIVEN** a user attempts to claim a mission
- **WHEN** the backend responds with an error
- **THEN** the `MotionsService` **MUST** keep the mission's state as unclaimed
- **AND** the `MotionsService` **MUST** emit a `missionFailed` event via its output signal with the `missionId` and the `error` message.

##### Scenario: Daily Reward Collection
- **GIVEN** the daily reward is available
- **WHEN** the user collects the daily reward successfully
- **THEN** the `MotionsService` **MUST** update the relevant state signals
- **AND** the `MotionsService` **MUST** emit a `dailyRewardCollected` event via its output signal with the reward `amount`.

### REMOVED Requirements

#### Requirement: Direct Effect Triggering
- **(Reason:** This logic is being decoupled into dedicated services (`AudioService`, `ConfettiService`) and orchestrated by the component layer to improve modularity, performance (via lazy loading), and user control.)

---

## Domain: `services/audio` (New)

### ADDED Requirements

#### Requirement: Lazy-Loaded Audio Playback

A new `AudioService` **MUST** be created to handle all audio playback. The audio library (e.g., Howler.js or native Web Audio API) **MUST** be loaded lazily only when a sound is first requested.

##### Scenario: First Sound Playback
- **GIVEN** the `AudioService` is initialized but the audio library is not yet loaded
- **WHEN** `play('claim')` is called for the first time
- **THEN** the service **MUST** first load the audio library
- **AND** the service **MUST** then play the 'claim' sound.

#### Requirement: User Mute Control

The `AudioService` **MUST** provide a mechanism for the user to mute and unmute all sounds. This state **MUST** be managed by an Angular Signal.

##### Scenario: Muting Audio
- **GIVEN** audio is currently enabled
- **WHEN** the user interacts with a mute toggle control
- **THEN** the `AudioService`'s `toggleMute()` method is called
- **AND** the `muted` signal **MUST** be set to `true`
- **AND** subsequent calls to `play()` **MUST NOT** produce any sound.

##### Scenario: Unmuting Audio
- **GIVEN** audio is currently muted
- **WHEN** the user interacts with the mute toggle control again
- **THEN** the `AudioService`'s `toggleMute()` method is called
- **AND** the `muted` signal **MUST** be set to `false`
- **AND** subsequent calls to `play()` **MUST** produce sound.

---

## Domain: `services/confetti` (New)

### ADDED Requirements

#### Requirement: Lazy-Loaded Confetti Effect

A new `ConfettiService` **MUST** be created to handle all confetti effects. The `canvas-confetti` library **MUST** be loaded lazily only when an effect is first triggered.

##### Scenario: First Confetti Trigger
- **GIVEN** the `ConfettiService` is initialized but the confetti library is not loaded
- **WHEN** `trigger('win')` is called for the first time
- **THEN** the service **MUST** first load the `canvas-confetti` library
- **AND** the service **MUST** then display the 'win' confetti animation.

#### Requirement: Respect Reduced Motion Preference

The `ConfettiService` **MUST** respect the user's operating system preference for reduced motion.

##### Scenario: User Prefers Reduced Motion
- **GIVEN** the user's system has `prefers-reduced-motion: reduce` enabled
- **AND** the `enabled` signal in the service is `true`
- **WHEN** `trigger('win')` is called
- **THEN** the service **MUST NOT** display the confetti animation.

#### Requirement: User-Enabled Control

The `ConfettiService` **MUST** provide a mechanism for the user to enable or disable confetti effects, independent of the system's reduced motion setting.

##### Scenario: User Disables Confetti
- **GIVEN** confetti is currently enabled via the service's `enabled` signal
- **WHEN** the user interacts with a toggle to disable effects
- **THEN** the `ConfettiService`'s `toggle()` method is called
- **AND** the `enabled` signal **MUST** be set to `false`
- **AND** subsequent calls to `trigger()` **MUST NOT** display any confetti.

---

## Domain: `components/motions`

### MODIFIED Requirements

#### Requirement: Orchestration of UI Effects

The `MotionsComponent` **MUST** act as the orchestrator. It **MUST** inject the `MotionsService`, `AudioService`, and `ConfettiService`. It **MUST** use an Angular `effect()` to listen to the output signals from `MotionsService` and trigger the appropriate methods on the `AudioService` and `ConfettiService`.

**(Previously: The component may have had some direct UI logic or relied on the service to do everything.)**

##### Scenario: Orchestrating a Successful Claim
- **GIVEN** the `MotionsComponent` is active
- **WHEN** the `MotionsService` emits a `missionClaimed` event
- **THEN** the `effect()` in `MotionsComponent` **MUST** detect the event
- **AND** the component **MUST** call `this.audioService.play('claim')`
- **AND** the component **MUST** call `this.confettiService.trigger('win')`.
