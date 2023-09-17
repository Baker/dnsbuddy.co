import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LocalQuery({
  domain,
  record_type,
}: {
  domain: string;
  record_type: string;
}) {
  return (
    <Tabs defaultValue='macos' className='pt-3 text-sm'>
      <TabsList>
        <TabsTrigger value='windows'>Windows</TabsTrigger>
        <TabsTrigger value='macos'>MacOS</TabsTrigger>
        <TabsTrigger value='linux'>Linux</TabsTrigger>
      </TabsList>
      <TabsContent value='windows'>
        <code>
          nslookup +{record_type} {domain} +short
        </code>
      </TabsContent>
      <TabsContent value='macos'>
        <code>
          dig {record_type} {domain} +short
        </code>
      </TabsContent>
      <TabsContent value='linux'>
        <code>
          dig {record_type} {domain} +short
        </code>
      </TabsContent>
    </Tabs>
  );
}
