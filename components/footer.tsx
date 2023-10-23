import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bottom-0 pb-2 text-center text-sm'>
      <p>
        {' '}
        This is an{' '}
        <Link
          href='//github.com/Baker/dnsbuddy.co'
          className='font-semibold underline'
        >
          open-sourced project
        </Link>{' '}
        by{' '}
        <Link href='//francispbaker.com' className='font-semibold underline'>
          Francis Baker
        </Link>
        .
      </p>{' '}
    </footer>
  );
}
