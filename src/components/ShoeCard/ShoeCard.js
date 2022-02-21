import React from "react";
import styled, { css } from "styled-components/macro";

import { COLORS, WEIGHTS } from "../../constants";
import { formatPrice, pluralize, isNewShoe } from "../../utils";
import Spacer from "../Spacer";

const getFlagText = (variant) => {
  if (variant === TagVariants.newRelease) {
    return "Just Released!";
  } else if (variant === TagVariants.onSale) {
    return "Sale";
  }
  throw new Error("Incorrect variant");
};

const ShoeCard = ({
  slug,
  name,
  imageSrc,
  price,
  salePrice,
  releaseDate,
  numOfColors,
}) => {
  // There are 3 variants possible, based on the props:
  //   - new-release
  //   - on-sale
  //   - default
  //
  // Any shoe released in the last month will be considered
  // `new-release`. Any shoe with a `salePrice` will be
  // on-sale. In theory, it is possible for a shoe to be
  // both on-sale and new-release, but in this case, `on-sale`
  // will triumph and be the variant used.
  // prettier-ignore
  const variant = typeof salePrice === 'number'
    ? TagVariants.onSale
    : isNewShoe(releaseDate)
      ? TagVariants.newRelease
      : TagVariants.default;

  return (
    <Link href={`/shoe/${slug}`}>
      <Wrapper>
        <ImageWrapper>
          <Image alt="" src={imageSrc} />
        </ImageWrapper>
        <Spacer size={12} />
        <Row>
          <Name>{name}</Name>
          <Price onSale={Boolean(salePrice)}>{formatPrice(price)}</Price>
        </Row>
        <Row>
          <ColorInfo>{pluralize("Color", numOfColors)}</ColorInfo>
          {salePrice ? <SalePrice>{formatPrice(salePrice)}</SalePrice> : null}
        </Row>
        {variant !== "default" && (
          <Flag style={STYLES[variant]}>{getFlagText(variant)}</Flag>
        )}
      </Wrapper>
    </Link>
  );
};

const TagVariants = {
  onSale: "on-sale",
  newRelease: "new-release",
  default: "default",
};

const STYLES = {
  [TagVariants.onSale]: {
    "--bgColor": COLORS.primary,
  },
  [TagVariants.newRelease]: {
    "--bgColor": COLORS.secondary,
  },
};

const Flag = styled.div`
  position: absolute;
  top: 12px;
  right: -4px;
  padding: 9px 11px;
  background-color: var(--bgColor);
  color: ${COLORS.white};
  border-radius: 2px;
  font-size: ${14 / 16}rem;
  font-weight: ${WEIGHTS.bold};
`;

const Link = styled.a`
  text-decoration: none;
  color: inherit;
  min-width: 275px;
  flex: 1;
`;

const Wrapper = styled.article`
  border-radius: 16px 16px 4px 4px;
  position: relative;
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const Image = styled.img`
  width: 100%;
`;

const Row = styled.div`
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
`;

const Name = styled.h3`
  font-weight: ${WEIGHTS.medium};
  color: ${COLORS.gray[900]};
`;

const SaleStyles = css`
  text-decoration-line: line-through;
  color: ${COLORS.gray[500]};
`;

const Price = styled.span`
  ${({ onSale }) => onSale && SaleStyles}
`;

const ColorInfo = styled.p`
  color: ${COLORS.gray[700]};
`;

const SalePrice = styled.span`
  font-weight: ${WEIGHTS.medium};
  color: ${COLORS.primary};
`;

export default ShoeCard;
