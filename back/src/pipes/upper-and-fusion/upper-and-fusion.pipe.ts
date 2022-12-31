import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { elementAt } from 'rxjs';

@Injectable()
export class UpperAndFusionPipe implements PipeTransform {
    transform(entry: { data: string[] }, metadata: ArgumentMetadata) {
        if (metadata.type === 'body') {
            return entry.data
                .map((element: string) => element.toUpperCase())
                .join('-');
        }
        return entry;
    }
}
