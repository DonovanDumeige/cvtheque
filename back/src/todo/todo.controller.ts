import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import { DurationInterceptor } from 'src/interceptors/duration/duration.interceptor';
import { UpperAndFusionPipe } from 'src/pipes/upper-and-fusion/upper-and-fusion.pipe';
import { AddTodoDto, GetPaginatedTodoDto } from './dto';
import { Todo } from './entities';
import { TodoService } from './todo.service';

@Controller('todo')
export class TodoController {
    constructor(private todoService: TodoService) {}
    @Get()
    getTodos(@Query() mesQueryParams: GetPaginatedTodoDto) {
        return this.todoService.getTodos();
    }

    @Get('/:id')
    getTodoById(@Param('id', ParseIntPipe) id: number) {
        return this.todoService.getTodoById(id);
    }

    @Post()
    addTodo(@Body() newTodo: AddTodoDto): Todo {
        return this.todoService.addTodo(newTodo);
    }
    //Supprimer un todo via son id.
    @Delete(':id')
    deleteTodo(@Param('id', ParseIntPipe) id: number) {
        return this.todoService.deleteTodo(id);
    }

    @Put(':id')
    editTodo(
        @Param('id', ParseIntPipe) id: number,
        @Body() newTodo: Partial<AddTodoDto>,
    ) {
        return this.todoService.editTodo(id, newTodo);
    }

    @Post('pipe')
    testPipe(@Param('data', UpperAndFusionPipe) ParamData, @Body() data) {
        return data;
    }
}
