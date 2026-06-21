const STEPS = ['Upload received', 'Preprocessing image', 'Running MVP demo inference', 'Completed'];

export default function StepTracker({ currentStep, progress }) {
  return (
    <section className="panel">
      <div className="progress-header">
        <h3>Processing status</h3>
        <span>{progress ?? 0}%</span>
      </div>
      <div className="progress-bar">
        <span style={{ width: `${progress ?? 0}%` }} />
      </div>
      <ol className="steps">
        {STEPS.map((step) => (
          <li className={step === currentStep ? 'active' : ''} key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}
