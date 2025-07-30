import React from 'react';
import {useWishWall} from '../hooks/useWishWall';
import AuthForm from "./auth/AuthForm.tsx";
import SceneContent from "./scene/SceneContent.tsx";
import PreviewModal from "./ui/PreviewModal.tsx";
import BackgroundColorProvider from "../providers/BackgroundColorProvider.tsx";
import BackgroundStyleProvider from "../providers/BackgroundStyleProvider.tsx";

const WishWall: React.FC = () => {
    const {
        isLoggedIn,
        formMode,
        setFormMode,
        username,
        setUsername,
        password,
        setPassword,
        error,
        setError,
        velocity,
        imageList,
        newImages,
        previewUrl,
        setPreviewUrl,
        wallLength,
        groundLength,
        cameraDropEnabled,
        handleImageUpload,
        handleDelete,
        handlePreview,
        handleLogin,
        handleRegister,
        handleVisitorLogin,
        handleLogout,
    } = useWishWall();

    return (
        <div className="w-screen h-screen">
            {(!isLoggedIn || formMode !== 'upload') && (
                <AuthForm
                    formMode={formMode}
                    setFormMode={setFormMode}
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                    error={error}
                    setError={setError}
                    onLogin={handleLogin}
                    onRegister={handleRegister}
                    onVisitorLogin={handleVisitorLogin}
                />
            )}

            <BackgroundStyleProvider>
                <BackgroundColorProvider>
                    <SceneContent
                        imageList={imageList}
                        newImages={newImages}
                        groundLength={groundLength}
                        wallLength={wallLength}
                        velocity={velocity}
                        cameraDropEnabled={cameraDropEnabled}
                        handleDelete={handleDelete}
                        handlePreview={handlePreview}
                        isLoggedIn={isLoggedIn}
                        onLogout={handleLogout}
                        onUpload={handleImageUpload}
                    />
                </BackgroundColorProvider>
            </BackgroundStyleProvider>

            {previewUrl && <PreviewModal image={previewUrl} onClose={() => setPreviewUrl(null)}/>}
        </div>
    );
};

export default WishWall;
