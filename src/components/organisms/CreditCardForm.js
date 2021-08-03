import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import validator from "card-validator";

import Container from "../atoms/Container";
import Text from "../atoms/Text";
import SubText from "../atoms/SubText";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import Button from "../atoms/Button";
import Spinner from "../atoms/Spinner";
import CardBrand from "../atoms/CardBrand";

import { cardSchema } from "../../validators/card";

const yearArr = (count) => {
  return new Array(count).fill().map((_, i) => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + i);
    return d.getFullYear().toString();
  });
};

const monthArr = () =>
  new Array(12).fill().map((_, i) => {
    const m = (i + 1).toString();
    return m > 9 ? m : "0" + m;
  });

const CreditCardForm = ({ onSubmit }) => {
  const { register, handleSubmit, watch, formState, setError, errors } =
    useForm({
      defaultValues: {
        cardHolder: "",
        cardNumber: "",
        expMonth: null,
        expYear: null,
        cvv: null,
        address: "",
        pin: "",
        zip: null,
      },
      resolver: yupResolver(cardSchema),
    });

  const { cardNumber, cvv } = watch();
  const { isSubmitting } = formState;

  const years = yearArr(5);
  const months = monthArr();

  const issuer = validator.number(cardNumber).card?.type;
  const securityCode = validator.number(cardNumber).card?.code;
  const validNumber = validator.number(cardNumber).isValid;

  const sanitizeCard = (formData) => {
    // list of supported card types
    const supportedCards = [
      "american-express",
      "discover",
      "mastercard",
      "visa",
    ];

    // validate card number
    if (!supportedCards.includes(issuer)) {
      return setError("cardNumber", {
        type: "Server",
        message: "Card not supported",
      });
    } else if (!validNumber) {
      return setError("cardNumber", {
        type: "server",
        message: "Invalid Card Number",
      });
    }

    // validate cvv
    if (securityCode.size !== cvv.length) {
      return setError("cvv", {
        type: "server",
        message: "Invalide Security Code",
      });
    }

    const { expMonth, expYear, ...rest } = formData;
    const data = {
      ...rest,
      issuer,
      expDate: expMonth + "/" + expYear.slice(2),
    };

    return onSubmit(data);
  };

  return (
    <Container as="form" onSubmit={handleSubmit(sanitizeCard)} wide>
      <Input
        label="Card Holder"
        placeholder="Name on Card"
        radius="8px"
        m="12px 0"
        ref={register}
        name="cardHolder"
        error={errors.cardHolder?.message}
      />
      <Input
        extra={
          issuer && (
            <Container flex="space-between" wide>
              <SubText p="0" font="12px" bold>
                Card Number
              </SubText>
              <CardBrand size="24px" logo={issuer} />
            </Container>
          )
        }
        label="Card Number"
        placeholder="Card Number"
        type="tel"
        radius="8px"
        m="12px 0"
        ref={register}
        name="cardNumber"
        error={errors.cardNumber?.message}
      />
      <Container flex="space-between" m="8px 0" wide>
        <Select
          w="calc(50% - 6px)"
          radius="8px"
          label="Exp Month"
          ref={register}
          name="expMonth"
          error={errors.expMonth?.message}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </Select>
        <Select
          w="calc(50% - 6px)"
          radius="8px"
          label="Exp Year"
          ref={register}
          name="expYear"
          error={errors.expYear?.message}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </Container>
      <Input
        radius="8px"
        label="Security Code"
        placeholder={securityCode?.name || "Security Code"}
        type="tel"
        ref={register}
        name="cvv"
        error={errors.cvv?.message}
      />

      <Input
        radius="8px"
        label="Billing Address"
        placeholder="Billing Address"
        ref={register}
        name="address"
        error={errors.address?.message}
      />

      <Container flex="space-between" m="8px 0" wide>
        <Input
          w="calc(50% - 6px)"
          radius="8px"
          label="Pin"
          placeholder="Pin"
          ref={register}
          name="pin"
          error={errors.pin?.message}
        />
        <Input
          w="calc(50% - 6px)"
          radius="8px"
          label="Zip Code"
          placeholder="Zip Code"
          type="tel"
          ref={register({
            valueAsNumber: true,
          })}
          name="zip"
          error={errors.zip?.message}
        />
      </Container>

      <Text font="12px" p="0" align="center" multiline>
        Please ensure card credentials are correct. Transactions made to wrong
        cards cannot be reverted
      </Text>

      <Button
        type="submit"
        bg="skyblue"
        radius="4px"
        m="24px 0"
        full
        bold
        disabled={isSubmitting}
      >
        {isSubmitting ? <Spinner /> : "Add Card"}
      </Button>
    </Container>
  );
};

export default CreditCardForm;
