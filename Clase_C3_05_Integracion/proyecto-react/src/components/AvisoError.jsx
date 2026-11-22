import Alert from "react-bootstrap/Alert";

export function AvisoError({ children }) {
  return <Alert variant="danger" role="alert">{children}</Alert>;
}
