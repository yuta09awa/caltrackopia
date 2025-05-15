
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Section } from "../types";

interface StoreSectionsProps {
  sections: Section[];
}

const StoreSections = ({ sections }: StoreSectionsProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Store Sections</h3>
      <Accordion type="single" collapsible>
        {sections.map((section) => (
          <AccordionItem key={section.name} value={section.name}>
            <AccordionTrigger className="hover:no-underline">
              {section.name}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground mb-2">
                {section.description}
              </p>
              <div className="mt-2">
                <p className="text-xs font-medium">Popular Items</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {section.popular.map((item, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{item}</Badge>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default StoreSections;
