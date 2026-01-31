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

interface TaskReminderEmailProps {
  userName: string;
  taskTitle: string;
  dueDate: string;
  daysLeft: number;
}

export default function TaskReminderEmail({
  userName,
  taskTitle,
  dueDate,
  daysLeft,
}: TaskReminderEmailProps) {
  const urgencyText =
    daysLeft === 0
      ? "C'est aujourd'hui !"
      : daysLeft === 1
        ? "C'est demain !"
        : `Plus que ${daysLeft} jours`;

  return (
    <Html>
      <Head />
      <Preview>
        {urgencyText} - {taskTitle}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Heading style={h1}>⏰ Rappel de tâche</Heading>

            <Text style={text}>Bonjour {userName},</Text>

            <Text style={text}>
              N'oubliez pas de compléter la tâche suivante :
            </Text>

            <Section style={taskBox}>
              <Text style={taskTitle_style}>📝 {taskTitle}</Text>
              <Text style={taskDue}>
                Échéance : <strong>{dueDate}</strong>
              </Text>
              <Text style={urgency}>{urgencyText}</Text>
            </Section>

            <Button style={button} href="https://carnetmariage.com/dashboard/taches">
              Voir mes tâches
            </Button>

            <Hr style={hr} />

            <Text style={footer}>
              Vous recevez cet email car vous avez activé les notifications sur CarnetMariage.
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

const taskBox = {
  backgroundColor: "#fdf2f8",
  borderRadius: "12px",
  padding: "20px",
  margin: "24px 0",
  borderLeft: "4px solid #ec4899",
};

const taskTitle_style = {
  color: "#1d1d1f",
  fontSize: "18px",
  fontWeight: "bold" as const,
  margin: "0 0 8px 0",
};

const taskDue = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0 0 8px 0",
};

const urgency = {
  color: "#ec4899",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0",
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
