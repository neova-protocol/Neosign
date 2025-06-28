interface Ellipse {
  id?: string
  cx: number
  cy: number
  rx: number
  ry: number
  transform: string
  fill: string
}

const ellipses: Ellipse[] = [
  {
    cx: 53.9711,
    cy: 53.6564,
    fill: "#1F91F1",
    id: "1",
    rx: 8.92266,
    ry: 12.1673,
    transform: "rotate(131.08 53.9711 53.6564)",
  },
  {
    cx: 86.4163,
    cy: 53.6562,
    fill: "#02E8CA",
    id: "2",
    rx: 8.92266,
    ry: 12.1673,
    transform: "rotate(-131.078 86.4163 53.6562)",
  },
  {
    cx: 55.2404,
    cy: 84.807,
    fill: "#6978FB",
    id: "3",
    rx: 8.92266,
    ry: 12.1673,
    transform: "rotate(40.44 55.2404 84.807)",
  },
  {
    cx: 86.1119,
    cy: 90.212,
    fill: "#06D6F4",
    id: "4",
    rx: 8.92266,
    ry: 12.1673,
    transform: "rotate(-40.4437 86.0653 84.8069)",
  },
  {
    cx: 85.3037,
    cy: 13.3871,
    fill: "#02E8CA",
    id: "5",
    rx: 8.92266,
    ry: 12.1673,
    transform: "rotate(-171.216 85.3037 13.3871)",
  },

  {
    cx: 110.75,
    cy: 27.6994,
    fill: "#02E8CA",
    id: "6",
    rx: 8.92266,
    ry: 12.1673,
    transform: "rotate(-131.078 110.75 27.6994)",
  },
  {
    cx: 126.305,
    cy: 54.4912,
    fill: "#02E8CA",
    id: "7",
    rx: 8.92266,
    ry: 12.1673,
    transform: "rotate(-108.428 126.305 54.4912)",
  },
  {
    cx: 125.592,
    cy: 84.0939,
    fill: "#06D6F4",
    id: "8",
    rx: 8.92266,
    ry: 12.1673,
    transform: "rotate(-78.9448 125.592 84.0939)",
  },
  {
    cx: 112.023,
    cy: 110.764,
    fill: "#06D6F4",
    id: "9",
    rx: 8.92266,
    ry: 12.1673,
    transform: "rotate(-40.4437 112.023 110.764)",
  },
  {
    cx: 86.1119,
    cy: 124.212,
    fill: "#06D6F4",
    id: "10",
    rx: 8.92266,
    ry: 12.1673,
    transform: "rotate(-13.3149 86.1119 124.212)",
  },
  {
    cx: 55.2871,
    cy: 124.211,
    fill: "#6978FB",
    id: "11",
    rx: 8.92266,
    ry: 12.1673,
    transform: "rotate(13.31 55.2871 124.211)",
  },
  {
    cx: 29.2843,
    cy: 110.764,
    fill: "#6978FB",
    id: "12",
    rx: 8.92266,
    ry: 12.1673,
    transform: "rotate(40.44 29.2843 110.764)",
  },
  {
    cx: 15.2773,
    cy: 84.0947,
    fill: "#6978FB",
    id: "13",
    rx: 8.92266,
    ry: 12.1673,
    transform: "rotate(78.94 15.2773 84.0947)",
  },
  {
    cx: 14.3644,
    cy: 54.4915,
    fill: "#1F91F1",
    id: "14",
    rx: 8.92266,
    ry: 12.1673,
    transform: "rotate(108.43 14.3644 54.4915)",
  },
  {
    cx: 29.6361,
    cy: 27.6995,
    fill: "#1F91F1",
    id: "15",
    rx: 8.92266,
    ry: 12.1673,
    transform: "rotate(131.08 29.6361 27.6995)",
  },
  {
    cx: 56.102,
    cy: 13.3867,
    fill: "#1F91F1",
    id: "16",
    rx: 8.92266,
    ry: 12.1673,
    transform: "rotate(171.22 56.102 13.3867)",
  },
]

export const NeovaLogo = (props: any) => {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 141 139"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {ellipses.map((ellipse, index) => (
        <ellipse key={index} {...ellipse} />
      ))}
    </svg>
  )
} 