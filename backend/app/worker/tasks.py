from app.worker.celery_app import celery_app
import time
import logging

logger = logging.getLogger(__name__)

@celery_app.task(name="send_rsvp_email_confirmation")
def send_rsvp_email_confirmation(email: str, event_title: str):
    """
    Mock Email task. In production, use SendGrid, SES, etc.
    """
    logger.info(f"Preparing to send RSVP confirmation to {email} for '{event_title}'...")
    time.sleep(2) # Simulate network delay
    logger.info(f"EMAIL SENT: Successfully sent email to {email}")
    return True

@celery_app.task(name="send_event_reminder_sms")
def send_event_reminder_sms(phone_number: str, event_title: str):
    """
    Mock SMS task. In production, use Twilio, SNS, etc.
    """
    logger.info(f"Preparing to send SMS reminder to {phone_number} for '{event_title}'...")
    time.sleep(1) # Simulate network delay
    logger.info(f"SMS SENT: Successfully sent SMS to {phone_number}")
    return True
