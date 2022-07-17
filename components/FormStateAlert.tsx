export type FormState = 'idle' | 'submitting' | 'success' | 'error'

type FormStateAlertProps = {
  state: FormState
  submittingMsg: string
  successMsg: string
  errorMsg: string
  logs?: string[]
}

const FormStateAlert = ({
  state,
  submittingMsg,
  successMsg,
  errorMsg,
  logs,
}: FormStateAlertProps) => {
  const alertClass: Record<FormState, string> = {
    idle: '',
    submitting: 'alert-info',
    success: 'alert-success',
    error: 'alert-error',
  }

  const svgPath: Record<FormState, string> = {
    idle: '',
    submitting: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    error:
      'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  }

  const alertMsg: Record<FormState, string> = {
    idle: '',
    submitting: submittingMsg,
    success: successMsg,
    error: errorMsg,
  }

  if (state === 'idle') {
    return <div></div>
  }

  const LogsCollapse = () =>
    logs?.length ? (
      <div tabIndex={0} className="collapse collapse-arrow">
        <input type="checkbox" />
        <div className="collapse-title font-bold">Logs</div>
        <ul className="collapse-content">
          {logs.map((log, idx) => <li key={idx}>{log}</li>)}
        </ul>
      </div>
    ) : null

  return (
    <div className={`alert ${alertClass[state]} shadow-lg flex-col items-start gap-0`}>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current flex-shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={svgPath[state]}
          ></path>
        </svg>
        <span>{alertMsg[state]}</span>
      </div>
      <LogsCollapse />
    </div>
  )
}

export default FormStateAlert
