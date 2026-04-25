# Snippet 5: Notification Service
# Review this code for issues.

class NotificationService:
    def send(self, user_id, message, channel, priority, retry_count,
             template_id, metadata, schedule_time, batch_id, campaign_id,
             personalization, tracking_enabled, fallback_channel,
             rate_limit_group, dedup_key):
        """Send a notification through the specified channel."""

        if channel == 'email':
            if priority == 'high':
                if template_id:
                    if personalization:
                        if tracking_enabled:
                            if schedule_time:
                                if batch_id:
                                    self._send_scheduled_batch_personalized_tracked_template_email(
                                        user_id, message, template_id, personalization,
                                        schedule_time, batch_id, metadata, campaign_id
                                    )
                                else:
                                    self._send_scheduled_personalized_tracked_template_email(
                                        user_id, message, template_id, personalization,
                                        schedule_time, metadata, campaign_id
                                    )
                            else:
                                self._send_personalized_tracked_template_email(
                                    user_id, message, template_id, personalization,
                                    metadata, campaign_id
                                )
                        else:
                            self._send_personalized_template_email(
                                user_id, message, template_id, personalization
                            )
                    else:
                        self._send_template_email(user_id, message, template_id)
                else:
                    self._send_plain_email(user_id, message)
            elif priority == 'low':
                self._queue_email(user_id, message)
            else:
                self._send_plain_email(user_id, message)
        elif channel == 'sms':
            if len(message) > 160:
                self._send_multipart_sms(user_id, message)
            else:
                self._send_sms(user_id, message)
        elif channel == 'push':
            self._send_push(user_id, message, metadata)
        elif channel == 'slack':
            self._send_slack(user_id, message)
        elif channel == 'webhook':
            self._send_webhook(user_id, message, metadata)
        else:
            raise ValueError(f"Unknown channel: {channel}")

    # ... imagine 20+ private methods like these:
    def _send_scheduled_batch_personalized_tracked_template_email(self, *args): pass
    def _send_scheduled_personalized_tracked_template_email(self, *args): pass
    def _send_personalized_tracked_template_email(self, *args): pass
    def _send_personalized_template_email(self, *args): pass
    def _send_template_email(self, *args): pass
    def _send_plain_email(self, *args): pass
    def _queue_email(self, *args): pass
    def _send_multipart_sms(self, *args): pass
    def _send_sms(self, *args): pass
    def _send_push(self, *args): pass
    def _send_slack(self, *args): pass
    def _send_webhook(self, *args): pass



"""
Snippet 5 Review — Notification Service

1. Structure & Readability
- [Critical] Extremely long method signature (16 parameters) → unmanageable API surface
- [Critical] Deep nesting (multiple levels of if-statements) → "arrow code" / pyramidal structure
- [Major] Method violates Single Responsibility Principle (routing + logic + orchestration all together)
- [Major] Channel logic tightly coupled inside one function (no abstraction per channel)
- [Minor] Inconsistent decision flow across channels (email vs sms vs push handled differently)

Impact:
- Very hard to read, debug, or extend
- Small changes risk breaking unrelated branches
- Onboarding new developers would be difficult

--------------------------------------------------

2. Logic & Correctness
- [Major] Priority handling only implemented for email, ignored or simplified for other channels
- [Major] Multiple condition combinations lead to fragile branching logic
- [Minor] No validation of parameter combinations (e.g., schedule_time without batch_id assumptions)
- [Minor] SMS logic assumes 160-char limit without encoding consideration

Impact:
- Inconsistent behavior across channels
- Hard-to-predict execution paths
- Edge combinations likely untested

--------------------------------------------------

3. Edge Cases & Error Handling
- [Major] No validation of required parameters per channel
- [Major] No fallback handling if internal `_send_*` methods fail
- [Minor] No handling for invalid types (e.g., None message, invalid user_id)
- [Minor] No retry logic usage despite `retry_count` parameter being unused

Impact:
- Silent failures possible
- Unused parameters indicate incomplete implementation
- Runtime errors likely in production edge cases

--------------------------------------------------

4. Security
- [Minor] Raises ValueError for unknown channel (good defensive check)
- [Minor] No input sanitization shown (depends on upstream validation)
- [Minor] Potential metadata leakage risk if passed directly to external services

Impact:
- No immediate critical vulnerabilities in this snippet
- Security depends heavily on external validation layers

--------------------------------------------------

5. Performance
- [Major] Excessive branching leads to high cognitive complexity (not runtime, but maintainability cost)
- [Minor] Potential redundant object passing across many internal methods
- [Minor] No batching strategy implemented despite "batch_id" concept

Impact:
- Hard to optimize or scale logic
- Adding new channels increases complexity exponentially
- Maintenance cost grows non-linearly

--------------------------------------------------

Severity Summary:
- Critical: 1 (extreme complexity / unmaintainable design)
- Major: 6+
- Minor: Several

--------------------------------------------------

Key Architectural Problems:
- “God method” anti-pattern (too many responsibilities in one function)
- Combinatorial explosion of conditions (template × personalization × tracking × schedule)
- No strategy/dispatcher pattern for channels
- No separation between decision-making and execution layers

--------------------------------------------------

Recommended Fix Focus:
- Replace nested if-else with a **strategy pattern or dispatcher map**
- Split email logic into dedicated handler class/module
- Group parameters into structured objects (e.g., NotificationRequest)
- Remove unused parameters or integrate them properly (retry_count)
- Standardize channel handlers to a uniform interface
- Flatten decision tree (avoid deep nesting entirely)
- Introduce validation layer per channel before execution
"""