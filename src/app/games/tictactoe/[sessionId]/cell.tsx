import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Cell = ({ index, currCell, onClick }: { index: number, currCell: string, onClick: (i: number) => void; }) => {
  return <Button variant={'outline'} className='w-32 h-32'
    id={`cell_${index}`}
    onClick={() => onClick(index)}
  ><CellImage cell={currCell} /></Button>;
};

const CellImage = ({ cell }: { cell: string; }) => {
  switch (cell) {
    case 'X':
      return <Image src={'/x.svg'} alt={cell} width={100} height={100} />;
    case 'O':
      return <Image src={'/o.svg'} alt={cell} width={100} height={100} />;
    default:
      return <span></span>;
  }
};

