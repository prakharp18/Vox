import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface PasswordChangedEmailProps {
  username: string;
  time: string;
  ip: string;
  device: string;
}

export default function PasswordChangedEmail({
  username,
  time,
  ip,
  device,
}: PasswordChangedEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Password Changed Successfully</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your password has been changed successfully.</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            Your password was recently changed.
          </Text>
        </Row>
        <Section style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px", margin: "20px 0" }}>
          <Row>
            <Text style={{ margin: "4px 0", fontSize: "14px", color: "#666" }}>
              <strong>Time:</strong> {time}
            </Text>
          </Row>
          <Row>
            <Text style={{ margin: "4px 0", fontSize: "14px", color: "#666" }}>
              <strong>IP Address:</strong> {ip}
            </Text>
          </Row>
          <Row>
            <Text style={{ margin: "4px 0", fontSize: "14px", color: "#666" }}>
              <strong>Device:</strong> {device}
            </Text>
          </Row>
        </Section>
        <Row>
          <Text>
            If you did not make this change, please secure your account immediately.
          </Text>
        </Row>
        <Row>
          <Button
            href={`http://localhost:3000/sign-in`}
            style={{ color: "#61dafb" }}
          >
            Sign In Now
          </Button>
        </Row>
      </Section>
    </Html>
  );
}
