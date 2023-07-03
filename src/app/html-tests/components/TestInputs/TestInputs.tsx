import styles from './styles.module.scss';

type TInputSkeleton = {
  title: string;
  type: string;
  attributes?: Record<string, unknown>;
}[];

export default function TestInputs() {
  const inputs: TInputSkeleton = [
    {
      title: 'Range',
      type: 'range',
      attributes: {
        min: 0,
        max: 100,
        step: 5,
      },
    },
    {
      title: 'Time',
      type: 'time',
    },
    {
      title: 'Date',
      type: 'date',
    },
    {
      title: 'Datetime Local',
      type: 'datetime-local',
    },
    {
      title: 'Month',
      type: 'month',
    },
    {
      title: 'Week',
      type: 'week',
    },
    {
      title: 'Color',
      type: 'color',
    },
    {
      title: 'File',
      type: 'file',
    },
    {
      title: 'Image',
      type: 'image',
      attributes: {
        alt: 'image',
        src: '/assets/images/space-cat.jpg',
      },
    },
    {
      title: 'Number',
      type: 'number',
    },
    {
      title: 'Tel',
      type: 'tel',
    },
    {
      title: 'URL',
      type: 'url',
    },
    {
      title: 'Email',
      type: 'email',
    },
    {
      title: 'Password',
      type: 'password',
    },
    {
      title: 'Search',
      type: 'search',
    },
    {
      title: 'Text',
      type: 'text',
    },
    {
      title: 'Checkbox',
      type: 'checkbox',
    },
    {
      title: 'Radio',
      type: 'radio',
    },
    {
      title: 'Button',
      type: 'button',
    },
    {
      title: 'Reset',
      type: 'reset',
    },
    {
      title: 'Submit',
      type: 'submit',
    },
    {
      title: 'Hidden',
      type: 'hidden',
    },
  ];

  return (
    <section className={styles.inputs}>
      <h1>All types of inputs</h1>
      <div>
        {inputs.map((input) => {
          const attributes = input.attributes || {};

          return (
            <div key={input.type}>
              <label htmlFor={input.type}>{input.title}</label>
              <input type={input.type} {...attributes} id={input.type} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
