import useMatchHighlightContext from 'Hooks/use-match-highlight';
import React from 'react';
import { getCalculatedStyles } from '../settings';

const Connector = ({
  bracketSnippet,
  previousBottomMatchPosition = null,
  previousTopMatchPosition = null,
  currentMatchPosition,
  style,
  winner = false,
}) => {
  const {
    boxHeight,
    connectorColor,
    roundHeader,
    roundSeparatorWidth,
    lineInfo,
    horizontalOffset,
    connectorColorHighlight,
    width,
  } = getCalculatedStyles(style);

  const pathInfo = multiplier => {
    const middlePointOfMatchComponent = boxHeight / 2;
    const previousMatch =
      multiplier > 0 ? previousBottomMatchPosition : previousTopMatchPosition;
    const horizontalWidthLeft =
      currentMatchPosition.x - roundSeparatorWidth / 2 - horizontalOffset;
    const isPreviousMatchOnSameYLevel =
      Math.abs(currentMatchPosition.y - previousMatch.y) < 1;

    const verticalHeight =
      previousMatch.y +
      middlePointOfMatchComponent +
      (roundHeader.isShown ? roundHeader.height + roundHeader.marginBottom : 0);
    const horizontalWidthRight = previousMatch.x + width;

    const startPoint = `${
      currentMatchPosition.x - horizontalOffset - lineInfo.separation
    } ${ winner ? (
        verticalHeight
      ) : (
        currentMatchPosition.y +
        lineInfo.homeVisitorSpread * multiplier +
        middlePointOfMatchComponent +
        (roundHeader.isShown ? roundHeader.height + roundHeader.marginBottom : 0)
      )
    }`;

    if (isPreviousMatchOnSameYLevel || winner) {
      return [`M${startPoint}`, `H${horizontalWidthRight}`];
    }

    return [
      `M${startPoint}`,
      `H${horizontalWidthLeft}`,
      `V${verticalHeight}`,
      `H${horizontalWidthRight}`,
    ];
  };

  const { topHighlighted, bottomHighlighted } = useMatchHighlightContext({
    bracketSnippet,
  });

  const { x, y } = currentMatchPosition;
  return (
    <>
      {previousTopMatchPosition && (
        <path
          d={pathInfo(-1).join(' ')}
          id={`connector-${x}-${y}-${-1}`}
          fill="transparent"
          stroke={connectorColor}
          stroke-opacity={(bracketSnippet?.previousTopMatch?.state == 'Finished' || bracketSnippet?.previousBottomMatch?.state == 'Finished') ? '100%' : '20%'}
        />
      )}
      {!winner && previousBottomMatchPosition && (
        <path
          d={pathInfo(1).join(' ')}
          id={`connector-${x}-${y}-${1}`}
          fill="transparent"
          stroke={connectorColor}
          stroke-opacity={(bracketSnippet?.previousTopMatch?.state == 'Finished' || bracketSnippet?.previousBottomMatch?.state == 'Finished') ? '100%' : '20%'}
        />
      )}

      {topHighlighted && <use href={`connector-${x}-${y}-${-1}`} />}
      {bottomHighlighted && <use href={`connector-${x}-${y}-${1}`} />}
    </>
  );
};
export default Connector;
