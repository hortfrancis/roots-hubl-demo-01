import clsx from 'clsx';

export default function DemoUI() {

  const layoutStyles = clsx(
    'grid grid-cols-4 grid-rows-8',
    'w-[400px] h-[800px]',
    'bg-white'
  );

  const globalNavStyles = clsx(
    'col-start-1 col-end-5 row-start-1 row-end-2',
    'flex justify-center items-center',
    'bg-gray-200'
  );

  const mainStyles = clsx(
    'col-start-1 col-end-5 row-start-2 row-end-7',
    'bg-gray-100',
    'flex flex-col items-center justify-center'
  );

  const convoStatusStyles = clsx(
    'col-start-1 col-end-3 row-start-7 row-end-9',
    'bg-gray-200',
    'flex justify-center items-center'
  );

  const pressToSpeakStyles = clsx(
    'col-start-3 col-end-5 row-start-7 row-end-9',
    'bg-gray-200',
    'flex justify-center items-center',
    'p-2',
  );

  const pressToSpeakButtonStyles = clsx(
    'rounded-full',
    'w-full h-full',
    'bg-amber-500 text-white font-bold text-sm',
  );

  const NAME = 'roots-demo-ui-01';
  return (
    <div data-component={NAME}
      className='w-full h-full bg-black flex items-center justify-center'
    >
      <div className={layoutStyles}>
        <div className={globalNavStyles}>
          [Navigation]
        </div>

        <main className={mainStyles}>
          [Main Content]
        </main>


        <div className={convoStatusStyles}>
          [Convo Status]
        </div>

        <div className={pressToSpeakStyles}>
          <button className={pressToSpeakButtonStyles}>
            [Press to Speak]
          </button>
        </div>

      </div >
    </div >
  )
}