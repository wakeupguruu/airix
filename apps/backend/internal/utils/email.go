package utils                                                                                  
                                                                                                   
import (
	"fmt"
	"net/smtp"
	"os"          
)                                                                                              
																								
                                   
func SendEmail(toEmail string, subject string, body string) error {
	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")
	username := os.Getenv("SMTP_USERNAME")
	password := os.Getenv("SMTP_PASSWORD")
	from := os.Getenv("SMTP_FROM_EMAIL")
																								
	
	auth := smtp.PlainAuth("", username, password, host)
																								

	msg := []byte("To: " + toEmail + "\r\n" +
	"Subject: " + subject + "\r\n" +
	"MIME-version: 1.0;\r\n" +
	"Content-Type: text/html; charset=\"UTF-8\";\r\n\r\n" +
	body)
																					
	address := fmt.Sprintf("%s:%s", host, port)
	err := smtp.SendMail(address, auth, from, []string{toEmail}, msg)
	
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}
	return nil
}

func GetOTPHTMLTemplate(otp string) string {
	return fmt.Sprintf(`
	<!DOCTYPE html>
	<html>
	<body style="font-family: Arial, sans-serif; background-color: #f4f4f5; padding: 20px;">
		<div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
			<h2 style="color: #18181b; margin-bottom: 10px;">Password Reset Request</h2>
			<p style="color: #52525b; line-height: 1.5;">We received a request to reset your password for your Airix account. Use the 6-digit OTP below to securely reset your password.</p>
			
			<div style="background-color: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
				<span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #000000;">%s</span>
			</div>
			
			<p style="color: #52525b; font-size: 14px;">This code expires in 15 minutes. If you didn't request a password reset, you can safely ignore this email.</p>
			
			<hr style="border: none; border-top: 1px solid #e4e4e7; margin: 30px 0 20px 0;" />
			<p style="color: #a1a1aa; font-size: 12px; text-align: center;">© 2026 Airix. All rights reserved.</p>
		</div>
	</body>
	</html>
	`, otp)
}