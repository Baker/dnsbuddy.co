import { DomainWhoisData, IPWhoisData } from '@/lib/types/whois';
import Link from 'next/link';
import GenericToolTip from '@/components/tooltip';
import Image from 'next/image';

export function DomainWhoisResponse({
  response,
}: {
  response: DomainWhoisData;
}) {
  return (
    <div className='mx-auto my-6 max-w-full px-4 text-left text-gray-600 dark:text-gray-300 md:max-w-4xl'>
      <div className='grid grid-cols-3 gap-2 rounded-md border bg-black/5 p-8 dark:bg-white/5'>
        <h2 className='col-span-3 text-xl text-black dark:text-white'>
          Registar Information
        </h2>
        <h3 className='col-span-1'>Registar</h3>
        <span className='col-span-2 '>{response.registar}</span>
        <h3 className='col-span-1'>Referral URL</h3>
        <span className='col-span-2'>
          <Link className='underline' href={response.registarURL}>
            {response.registarURL}
          </Link>
        </span>
        <h3 className='col-span-1'>WHOIS Server</h3>
        <span className='col-span-2'>{response.registarWHOISServer}</span>
        <h3 className='col-span-1'>Status</h3>
        <span className='col-span-2'>
          {Array.isArray(response.domainStatus) ? (
            response.domainStatus.map((item, index) => (
              <pre key={index} className='whitespace-pre-line'>
                {item}
              </pre>
            ))
          ) : (
            <pre className='whitespace-pre-line'>{response.domainStatus}</pre>
          )}
        </span>
      </div>
      <div className='mt-4 grid grid-cols-6 gap-4'>
        <div className='col-span-6 grid grid-cols-3 gap-2 rounded-md border bg-black/5 p-8 leading-5 dark:bg-white/5 md:col-span-4'>
          <h2 className='col-span-6 text-xl text-black dark:text-white md:col-span-4'>
            Registration Information
          </h2>
          <h3 className='col-span-1'>Registration Date</h3>
          <span className='col-span-5 md:col-span-3'>
            {new Date(response.createdDate).toLocaleString()}
            <GenericToolTip
              text={`Here is the original timestamp in UTC: ${response.createdDate}`}
            />
          </span>
          <h3 className='col-span-1'>Updated date</h3>
          <span className='col-span-5 md:col-span-3'>
            {new Date(response.updatedDate).toLocaleString()}
            <GenericToolTip
              text={`Here is the original timestamp in UTC: ${response.updatedDate}`}
            />
          </span>
          <h3 className='col-span-1'>Expiration date</h3>
          <span className='col-span-5 md:col-span-3'>
            {new Date(response.expiryDate).toLocaleString()}
            <GenericToolTip
              text={`Here is the original timestamp in UTC: ${response.expiryDate}`}
            />
          </span>
        </div>
        <div className='col-span-6 grid grid-cols-2 gap-2 rounded-md border bg-black/5 p-8 leading-5 dark:bg-white/5 md:col-span-2'>
          <h2 className='col-span-2 text-xl text-black dark:text-white'>
            Nameservers
          </h2>
          <span>
            {response.nameServer.map((item, index) => (
              <pre key={index} className=''>
                {item}
              </pre>
            ))}
          </span>
        </div>
      </div>
      <details className='mt-4'>
        <summary>Raw Whois</summary>
        {Object.keys(response.raw).map((key: string, index: number) => {
          // @ts-ignore
          if (Array.isArray(response.raw[key])) {
            return (
              <>
                <pre key={index.toString()}>{key}:</pre>
                {/* @ts-ignore */}
                {response.raw[key].map((item: string, innerIndex: number) => (
                  <pre key={innerIndex} className='text-no-wrap'>
                    {item}:
                  </pre>
                ))}
              </>
            );
          } else {
            return (
              <pre key={index}>
                {/* @ts-ignore */}
                {key}: {response.raw[key]}
              </pre>
            );
          }
        })}
      </details>
    </div>
  );
}

export function IpAddressWhoisReponse({ response }: { response: IPWhoisData }) {
  return (
    <div className='mx-auto my-6 max-w-full px-4 text-left text-gray-600 dark:text-gray-300 md:max-w-4xl'>
      <div className='grid grid-cols-6 gap-4'>
        <div className='col-span-6 grid grid-cols-3 gap-2 rounded-md border bg-black/5 p-8 dark:bg-white/5 md:col-span-3'>
          <h2 className='col-span-3 text-xl text-black dark:text-white'>
            Range Information
          </h2>
          <h3 className='col-span-1'>Organization</h3>
          <span className='col-span-2 '>{response.Organization}</span>
          <h3 className='col-span-1'>NetName</h3>
          <span className='col-span-2 '>{response.NetName}</span>
          <h3 className='col-span-1'>Range</h3>
          <span className='col-span-2'>
            <Link className='underline break-all' href={response.Ref}>
              {response.range}
            </Link>
          </span>
          <h3 className='col-span-1'>Route</h3>
          <span className='col-span-2'>{response.route}</span>
          <h3 className='col-span-1'>ASN</h3>
          <span className='col-span-2'>
            <Link className='underline' href={`/tools/asn/${response.asn}`}>
              {response.asn}
            </Link>
          </span>
          <h3 className='col-span-1'>Registration</h3>
          <span className='col-span-2'>{response.RegDate}</span>
          <h3 className='col-span-1'>Updated</h3>
          <span className='col-span-2'>{response.Updated}</span>
        </div>
        <div className='col-span-6 grid grid-cols-3 gap-2 rounded-md border bg-black/5 p-8 dark:bg-white/5 md:col-span-3'>
          <h2 className='col-span-3 text-xl text-black dark:text-white'>
            Organization Information
          </h2>
          <h3 className='col-span-1'>Organization</h3>
          <span className='col-span-2 '>
            <Link className='underline' href={response.organisation.Ref}>
              {response.organisation.OrgName}
            </Link>
          </span>
          <h3 className='col-span-1'>OrgID</h3>
          <span className='col-span-2 '>{response.organisation.OrgId}</span>
          <h3 className='col-span-1'>Address</h3>
          <span className='col-span-2'>{response.organisation.Address}</span>
          <h3 className='col-span-1'>City</h3>
          <span className='col-span-2'>{response.organisation.City}</span>
          <h3 className='col-span-1'>State/Providence</h3>
          <span className='col-span-2'>{response.organisation.StateProv}</span>
          <h3 className='col-span-1'>Postal Code</h3>
          <span className='col-span-2'>{response.organisation.PostalCode}</span>
          <h3 className='col-span-1'>Country</h3>
          <span className='col-span-2'>
            <Image
              width={64}
              height={64}
              src={`https://flagsapi.com/${response.organisation.Country}/flat/64.png`}
              alt={`${response.organisation.Country} flag`}
              className='mr-1 inline-block h-4 w-4'
            />
            {response.organisation.Country}
          </span>
          <h3 className='col-span-1'>RegDate</h3>
          <span className='col-span-2'>{response.RegDate}</span>
          <h3 className='col-span-1'>Updated</h3>
          <span className='col-span-2'>{response.Updated}</span>
        </div>
      </div>
      <div className='mt-4 grid grid-cols-6 gap-4'>
        {response.contactAbuse && (
          <SmallSquare
            title='Abuse Information'
            link={response.contactAbuse?.Handle}
            href={response.contactAbuse?.Ref}
            phone={response.contactAbuse?.Phone}
            email={response.contactAbuse?.Email}
          />
        )}
        {response.contactTechnical && (
          <SmallSquare
            title='Technical Information'
            link={response.contactTechnical?.Handle}
            href={response.contactTechnical?.Ref}
            phone={response.contactTechnical?.Phone}
            email={response.contactTechnical?.Email}
          />
        )}
        {response.contactRouting && Object.keys(response.contactRouting).length > 0 && (
          <SmallSquare
            title='Routing Information'
            link={response.contactRouting?.Handle}
            href={response.contactRouting?.Ref}
            phone={response.contactRouting?.Phone}
            email={response.contactRouting?.Email}
          />
        )}
        {response.contactNoc && (
          <SmallSquare
            title='NOC Information'
            link={response.contactNoc?.Handle}
            href={response.contactNoc?.Ref}
            phone={response.contactNoc?.Phone}
            email={response.contactNoc?.Email}
          />
        )}
        {response.contactDNS && Object.keys(response.contactDNS).length > 0 && (
          <SmallSquare
            title='DNS Information'
            link={response.contactDNS?.Handle}
            href={response.contactDNS?.Ref}
            phone={response.contactDNS?.Phone}
            email={response.contactDNS?.Email}
          />
        )}
      </div>
    </div>
  );
}

function SmallSquare({
  title,
  link,
  href,
  phone,
  email,
}: {
  title: string;
  link: string;
  href: string;
  phone: string;
  email: string;
}) {
  return (
    <div className='col-span-9 grid grid-cols-3 gap-2 rounded-md border bg-black/5 p-8 dark:bg-white/5 md:col-span-3'>
      <h2 className='col-span-3 text-xl text-black dark:text-white'>{title}</h2>
      <h3 className='col-span-1'>Handle</h3>
      <span className='col-span-2 '>
        <Link className='underline' href={href || '#'}>
          {link}
        </Link>
      </span>
      <h3 className='col-span-1'>Phone</h3>
      <span className='col-span-2 '>{phone}</span>
      <h3 className='col-span-1'>Email</h3>
      <span className='col-span-2 break-all '>{email}</span>
    </div>
  );
}
