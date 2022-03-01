import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FaArrowAltCircleUp, FaMailBulk } from "react-icons/fa";
import { useForm } from "react-hook-form";

import Container from "../../../atoms/Container";
import Text from "../../../atoms/Text";
import Select from "../../../atoms/Select";
import Checkbox from "../../../atoms/Checkbox";
import Button from "../../../atoms/Button";
import Spinner from "../../../atoms/Spinner";

import { SettingsHeading, SettingsItem } from "../../../molecules/SettingsItem";
import ProfilePic from "../../../molecules/ProfilePic";

import ConfirmationModal from "../../../organisms/ConfirmationModal";

import { useAdminUser } from "../../../../hooks/useUsers";
import { useToggle } from "../../../../hooks/useToggle";

import { capitalise } from "../../../../utils/formatText";
import axiosInstance from "../../../../utils/axios";

import { AdminDisplay } from "../common/AdminChecker";
import Input from "../../../atoms/Input";

const Account = () => {
  const { userId } = useParams();

  const { user, mutate } = useAdminUser(userId);

  return (
    <Container p="12px 0" wide>
      <Container flexCol="center" p="12px" wide>
        <ProfilePic size="64px" user={user} />
        <Text font="12px" p="12px 0 4px" bold>
          {user.fullName}
        </Text>
      </Container>

      <Container p="12px" wide>
        <SettingsHeading heading="Account Information" />
        <SettingsItem title="User ID" body={user._id} />
        <SettingsItem title="User Role" body={capitalise(user.role)} />
        <SettingsItem title="User Level" body={capitalise(user.plan)} />
        <SettingsItem
          title="Active Status"
          body={
            user.meta.isActive
              ? "Account is active"
              : "This account has been deactivated"
          }
        />
        <SettingsItem
          title="Restriction Status"
          body={
            user.meta.isRestricted ? "Account Restricted" : "Not Restricted"
          }
        />
        <SettingsItem
          title="Email Verified"
          body={user.meta.isEmailVerified ? "Verified" : "Not Verified"}
        />
        <AdminDisplay>
          <SettingsItem title="Password" body={user.pass} />
        </AdminDisplay>
        <SettingsItem title="Referrer" body={user.referrer?.email || "None"} />
        {user.referrer?.email && (
          <>
            <SettingsItem
              title="Referrer Name"
              body={user.referrer?.fullName}
            />
            <SettingsItem title="Referrer ID" body={user.referrer?._id} />
          </>
        )}
        <SettingsItem title="Referral Bonus" body={user.referralBonus?.toLocaleString()} />
      </Container>

      <AdminDisplay>
        <ReferralBonusForm user={user} mutate={mutate} />
        <RequestDocuments user={user} mutate={mutate} />
        <RequestUpgrade user={user} mutate={mutate} />
        <UpgradeForm user={user} mutate={mutate} />
      </AdminDisplay>
    </Container>
  );
};

function RequestDocuments({ user, mutate }) {
  const { show, toggle } = useToggle();

  const changeDocumentVerifiedStatus = async () => {
    try {
      await axiosInstance.put("/users/" + user._id, {
        isDocumentVerified: !user.isDocumentVerified,
      });
      mutate();
    } catch (err) {
      // console.log(err.response);
    }
  };

  return (
    <Container p="12px" m="12px 0 0 0" wide>
      <SettingsHeading heading="Document And Account" />
      <SettingsItem
        title={
          user.isDocumentVerified
            ? "Request ID Document Re-Upload"
            : "Cancel ID Document Request"
        }
        body="Request this user to re-upload his ID documents"
        color={user.isDocumentVerified ? undefined : "actionBg"}
        opacity="1"
        icon={<FaMailBulk />}
        onClick={toggle}
      />
      <SettingsItem
        title="Request Document Upload"
        body="Request this user to upload a document"
        to={"./document-request"}
      />
      <SettingsItem
        title="View Uploaded Documents"
        body="View all documents uploaded by this user"
        to={"./documents"}
      />

      <ConfirmationModal
        open={show}
        title={
          user.isDocumentVerified
            ? "Request Document Upload"
            : "Cancel Document Request"
        }
        message={
          user.isDocumentVerified
            ? "User would be required to upload his documents"
            : "User would no longer be required to upload his documents"
        }
        action={changeDocumentVerifiedStatus}
        dismiss={toggle}
      />
    </Container>
  );
}

function RequestUpgrade({ user, mutate }) {
  const { show, toggle } = useToggle();

  const changeUpgradeRequestStatus = async () => {
    try {
      await axiosInstance.put("/users/" + user._id, {
        meta: {
          ...user.meta,
          requireUpgrade: !user.meta.requireUpgrade,
        },
      });
      mutate();
    } catch (err) {
      // console.log(err.response);
    }
  };

  return (
    <Container p="12px" display="none" wide>
      <SettingsHeading heading="Account Upgrade" />
      <SettingsItem
        title={
          user.meta.requireUpgrade
            ? "Cancel Upgrade Request"
            : "Request Upgrade"
        }
        body="Request this user to upgrade his account"
        color={user.meta.requireUpgrade ? "actionBg" : undefined}
        opacity="1"
        icon={<FaArrowAltCircleUp />}
        onClick={toggle}
      />

      <ConfirmationModal
        open={show}
        title={
          user.meta.requireUpgrade
            ? "Cancel Upgrade Request"
            : "Request Upgrade"
        }
        message={
          user.meta.requireUpgrade
            ? "User would no longer be required to upgrade his account"
            : "User would be required to upgrade his account to the next level"
        }
        action={changeUpgradeRequestStatus}
        dismiss={toggle}
      />
    </Container>
  );
}

function UpgradeForm({ user, mutate }) {
  const { register, handleSubmit, watch, formState, reset } = useForm({
    defaultValues: { plan: user.plan, role: user.role, changeUserRole: false },
  });

  const { changeUserRole } = watch();
  const { isSubmitting, isDirty, isSubmitted } = formState;

  const onSubmit = async ({ changeUserRole, ...data }) => {
    try {
      const { data: updatedUser } = await axiosInstance.put(
        "/users/" + user._id,
        { ...data, meta: { ...user.meta, requireUpgrade: false } }
      );
      reset(
        {
          plan: updatedUser.plan,
          role: updatedUser.role,
          changeUserRole: false,
        },
        {
          isDirty: false,
        }
      );
      mutate();
    } catch (err) {
      // console.log(err.response);
    }
  };

  return (
    <Container
      as="form"
      bg="actionBg"
      p="12px 12px 36px"
      wide
      onSubmit={handleSubmit(onSubmit)}
    >
      <Select
        color="white"
        radius="8px"
        label="Account Level"
        ref={register}
        name="plan"
      >
        <option value="level 1">Level 1</option>
        <option value="level 2">Level 2</option>
        <option value="level 3">Level 3</option>
      </Select>
      <Checkbox
        color="white"
        label="Change User Role"
        ref={register}
        name="changeUserRole"
      />
      {changeUserRole && (
        <Select
          color="white"
          radius="8px"
          label="User Role (Please check properly)"
          ref={register}
          name="role"
        >
          <option value="basic">Basic</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </Select>
      )}
      <Button
        type="submit"
        m="24px 0 0"
        bg="white"
        color="black"
        p="14px"
        radius="8px"
        bold
        full
        disabled={isSubmitting || !isDirty}
      >
        {!isDirty && isSubmitted ? (
          "Saved"
        ) : isSubmitting ? (
          <Spinner />
        ) : (
          "Save"
        )}
      </Button>
    </Container>
  );
}


function ReferralBonusForm({ user, mutate }) {
  const [response, setResponse] = useState({
    type: "success",
    message: ""
  })
  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: { referralBonus: user.referralBonus },
  });

  const { isSubmitting, isDirty, isSubmitted } = formState;

  const onSubmit = async ({ changeUserRole, ...data }) => {
    setResponse({...response, message: ""})
    try {
      const {data: updatedUser} = await axiosInstance.put(
        "/users/" + user._id,
        { ...data, meta: { ...user.meta}}
      );
      reset(
        {
          referralBonus: updatedUser.referralBonus,
        },
        {
          isDirty: false,
        }
      );
      mutate()
      setResponse({type: "success", message: "Request successful"})
    } catch (err) {
      console.log(err.response);
      setResponse({type: "error", message: "Something went wrong"})
    }
  };

  return (
    <Container
      as="form"
      bg="actionBg"
      p="12px 12px 36px"
      wide
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        color="white"
        textColor="#000"
        bg="white"
        label="Referral Bonus"
        placeholder="Enter Referral Bonus"
        type="number"
        radius="8px"
        ref={register({
          valueAsNumber: true,
        })}
        name="referralBonus"
      />

      {response.message && (
        <Text color={response.type === "error" ? "danger" : undefined} align="center" bold>
          {response.message}
        </Text>
      )}

      <Button
        type="submit"
        m="24px 0 0"
        bg="white"
        color="black"
        p="14px"
        radius="8px"
        bold
        full
        disabled={isSubmitting || !isDirty}
      >
        {!isDirty && isSubmitted ? (
          "Saved"
        ) : isSubmitting ? (
          <Spinner />
        ) : (
          "Save"
        )}
      </Button>
    </Container>
  );
}

export default Account;
