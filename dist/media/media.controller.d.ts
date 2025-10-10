import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    create(createMediaDto: CreateMediaDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateMediaDto: UpdateMediaDto): string;
    remove(id: string): string;
}
