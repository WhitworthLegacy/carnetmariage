import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
} from "@react-email/components";

interface GuestRSVPEmailProps {
  userName: string;
  guestName: string;
  response: "confirmed" | "declined" | "pending";
  guestCount?: number;
  dietaryRestrictions?: string;
}

export default function GuestRSVPEmail({
  userName,
  guestName,
  response,
  guestCount,
  dietaryRestrictions,
}: GuestRSVPEmailProps) {
  const emoji = response === "confirmed" ? "🎉" : response === "declined" ? "😔" : "⏳";
  const statusText =
    response === "confirmed"
      ? "a confirmé sa présence"
      : response === "declined"
        ? "ne pourra malheureusement pas venir"
        : "n'a pas encore répondu";

  return (
    <Html>
      <Head />
      <Preview>
        {emoji} {guestName} {statusText}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={h1}>{emoji} Mise à jour RSVP</Heading>

            <Text style={text}>Bonjour {userName},</Text>

            <Text style={text}>
              <strong>{guestName}</strong> {statusText} !
            </Text>

            {response === "confirmed" && (
              <Section style={guestBox}>
                {guestCount && guestCount > 1 && (
                  <Text style={guestDetail}>👥 {guestCount} personnes confirmées</Text>
                )}
                {dietaryRestrictions && (
                  <Text style={guestDetail}>🍽️ Régime : {dietaryRestrictions}</Text>
                )}
              </Section>
            )}

            <Button style={button} href="https://carnetmariage.com/dashboard/invites">
              Voir ma liste d'invités
            </Button>

            <Hr style={hr} />

            <Text style={footer}>
              Vous recevez cet email car vous avez activé les notifications RSVP sur CarnetMariage.
              <br />
              <a href="https://carnetmariage.com/dashboard/parametres" style={link}>
                Gérer mes notifications
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "12px",
};

const box = {
  padding: "0 48px",
};

const h1 = {
  color: "#1d1d1f",
  fontSize: "28px",
  fontWeight: "bold" as const,
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#484848",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const guestBox = {
  backgroundColor: "#ecfdf5",
  borderRadius: "12px",
  padding: "16px 20px",
  margin: "16px 0",
  borderLeft: "4px solid #10b981",
};

const guestDetail = {
  color: "#1d1d1f",
  fontSize: "14px",
  margin: "4px 0",
};

const button = {
  backgroundColor: "#ec4899",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold" as const,
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px",
  margin: "24px 0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "18px",
  textAlign: "center" as const,
};

const link = {
  color: "#ec4899",
  textDecoration: "underline",
};
