import { Card, CardContent, CardHeader, IconButton, Typography } from '@material-ui/core';
import React from 'react';
import { Game } from '../../../types/game';
import { Player } from '../../../types/player';
import { Status } from '../../../types/status';
import { getCards } from '../CardPicker/CardConfigs';
import './PlayerCard.css';
import DeleteForeverIcon from '@material-ui/icons/DeleteForeverTwoTone';
import { red } from '@material-ui/core/colors';
import { removePlayer } from '../../../service/players';
import { isModerator } from '../../../utils/isModerator';

interface PlayerCardProps {
  game: Game;
  player: Player;
  currentPlayerId: string;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ game, player, currentPlayerId }) => {
  const removeUser = (gameId: string, playerId: string) => {
    removePlayer(gameId, playerId);
  };

  return (
    <Card
      variant='outlined'
      className='PlayerCard'
      style={{
        backgroundColor: getCardColor(game, player.value),
      }}
    >
      <CardHeader
        className='PlayerCardTitle'
        title={player.name}
        titleTypographyProps={{ variant: 'subtitle2', noWrap: true, title: player.name }}
        action={
          isModerator(game.createdById, currentPlayerId) &&
          player.id !== currentPlayerId && (
            <IconButton
              title='Remove'
              className='RemoveButton'
              onClick={() => removeUser(game.id, player.id)}
              data-testid='remove-button'
              color='primary'
            >
              <DeleteForeverIcon fontSize='small' style={{ color: red[300] }} />
            </IconButton>
          )
        }
      />
      <CardContent className='PlayerCardContent'>
        <Typography
          variant={getCardValue(player, game)?.length < 2 ? 'h2' : 'h3'}
          className='PlayerCardContentMiddle'
        >
          {getCardValue(player, game)}
        </Typography>
      </CardContent>
    </Card>
  );
};

const getCardColor = (game: Game, value: number | undefined): string => {
  if (game.gameStatus !== Status.Finished) {
    return 'var(--color-background-secondary)';
  }
  const card = getCards(game.gameType).find((card) => card.value === value);
  return card ? card.color : 'var(--color-background-secondary)';
};

const getCardValue = (player: Player, game: Game) => {
  if (game.gameStatus !== Status.Finished) {
    return player.status === Status.Finished ? '👍' : '🤔';
  }

  if (game.gameStatus === Status.Finished) {
    if (player.status === Status.Finished) {
      if (player.value && player.value === -1) {
        return player.emoji || '☕'; // coffee emoji
      }
      return getCardDisplayValue(game, player.value);
    }
    return '🤔';
  }
  return '';
};

const getCardDisplayValue = (game: Game, cardValue: number | undefined): string => {
  const cards = game.cards?.length > 0 ? game.cards : getCards(game.gameType);
  return (
    cards.find((card) => card.value === cardValue)?.displayValue || cardValue?.toString() || ''
  );
};
