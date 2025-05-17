import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";
import { FirebaseAuthGuard } from "../auth/guards/firebase.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

interface FirebaseUser {
  uid: string;
  email: string;
}

@UseGuards(FirebaseAuthGuard)
@Controller("boards")
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  create(@CurrentUser() user: FirebaseUser, @Body() dto: CreateBoardDto) {
    return this.boardsService.createBoard(user.uid, user.email, dto);
  }

  @Get()
  findAll(@CurrentUser() user: FirebaseUser) {
    return this.boardsService.getUserBoards(user.email);
  }

  @Get("starred")
  findStarred(@CurrentUser() user: FirebaseUser) {
    return this.boardsService.getStarredBoards(user.email);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.boardsService.getBoardById(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateBoardDto,
    @CurrentUser() user: FirebaseUser
  ) {
    return this.boardsService.updateBoard(id, dto);
  }

  @Patch(":id/star")
  toggleStar(@Param("id") id: string) {
    return this.boardsService.toggleStarBoard(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.boardsService.deleteBoard(id);
  }

  @Patch(":id/collaborator/:collaboratorEmail")
  addCollaborator(
    @Param("id") id: string,
    @Param("collaboratorEmail") collaboratorEmail: string
  ) {
    return this.boardsService.addCollaborator(id, collaboratorEmail);
  }

  @Delete(":id/collaborator/:collaboratorEmail")
  removeCollaborator(
    @Param("id") id: string,
    @Param("collaboratorEmail") collaboratorEmail: string
  ) {
    return this.boardsService.removeCollaborator(id, collaboratorEmail);
  }
}
